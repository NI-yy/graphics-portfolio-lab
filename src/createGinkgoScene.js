import { Scene, FreeCamera, Vector3, Color4, Mesh, MeshBuilder, VertexData, ShaderMaterial, Effect } from '@babylonjs/core';

// Seeded, procedural geometry: the supplied photograph guides the composition;
// it is not used as a background texture.
Effect.ShadersStore.ginkgoVertexShader = `
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 uv;
uniform mat4 worldViewProjection;
uniform float time, foliage;
varying vec3 vPosition, vNormal;
varying vec4 vColor;
varying vec2 vUV;
void main(){
 vec3 p=position;
 float sway=sin(time*.55+p.x*.7+p.z*.35)*.055+sin(time*1.2+p.y*2.1+p.z)*.025;
 p.x+=sway*foliage; p.z+=sway*.45*foliage;
 vPosition=p;vNormal=normal;vColor=color;vUV=uv;
 gl_Position=worldViewProjection*vec4(p,1.);
}`;
Effect.ShadersStore.ginkgoFragmentShader = `
precision highp float;
varying vec3 vPosition, vNormal;
varying vec4 vColor;
varying vec2 vUV;
uniform float foliage;
void main(){
 vec3 n=normalize(vNormal);
 vec3 sun=normalize(vec3(-.5,.8,.3));
 float light=abs(dot(n,sun));
 vec3 c=vColor.rgb;
 if(foliage>.5){
   float patches=sin(vPosition.x*1.3+sin(vPosition.z*2.1))*sin(vPosition.y*1.5+vPosition.z);
   float veins=pow(abs(sin(atan(vUV.x,vUV.y)*24.)),16.)*smoothstep(.1,.5,length(vUV));
   c*=.51+light*.42+patches*.15;
   c+=vec3(.08,.065,.01)*veins;
   c+=vec3(.14,.085,.008)*pow(light,3.);
 }else{
   float grain=sin(vPosition.y*3.+sin(vPosition.x*19.+vPosition.z*21.)*3.);
   c*=.65+.25*max(dot(n,sun),0.)+grain*.08;
 }
 float fog=1.-exp(-length(vPosition)*.004);
 c=mix(c,vec3(.70,.76,.68),fog);
 gl_FragColor=vec4(c,1.);
}`;
Effect.ShadersStore.canopySkyVertexShader = `
precision highp float;
attribute vec3 position;
uniform mat4 worldViewProjection;
varying vec3 direction;
void main(){direction=position;gl_Position=worldViewProjection*vec4(position,1.);}`;
Effect.ShadersStore.canopySkyFragmentShader = `
precision highp float;
varying vec3 direction;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec3 d=normalize(direction);
 vec3 col=mix(vec3(.88,.90,.85),vec3(.36,.59,.79),pow(max(d.y,0.),.55));
 vec2 p=d.xz/max(d.y,.15)*2.;
 float cloud=noise(p)*.55+noise(p*2.7)*.3+noise(p*7.1)*.15;
 col=mix(col,vec3(.94,.95,.91),smoothstep(.56,.77,cloud)*.65);
 float sun=max(dot(d,normalize(vec3(-.5,.8,.3))),0.);
 col+=vec3(1.,.84,.55)*pow(sun,150.)*.45;
 gl_FragColor=vec4(col,1.);
}`;

export function createGinkgoScene(engine) {
 const scene=new Scene(engine);
 scene.clearColor=new Color4(.55,.7,.8,1);
 const camera=new FreeCamera('under the ginkgo trees',new Vector3(0,1.8,-1),scene);
 camera.fov=1.35; camera.minZ=.1; camera.maxZ=250;
 camera.setTarget(new Vector3(0,14,6));
 const sky=MeshBuilder.CreateSphere('autumn sky',{diameter:180,segments:24,sideOrientation:Mesh.BACKSIDE},scene);
 const skyMat=new ShaderMaterial('sky',scene,'canopySky',{attributes:['position'],uniforms:['worldViewProjection']});
 skyMat.backFaceCulling=false; sky.material=skyMat;
 let seed=417;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const branches={positions:[],indices:[],colors:[],uvs:[]}, leaves={positions:[],indices:[],colors:[],uvs:[]};
 function tube(a,b,r0,r1,initial){
  const axis=b.subtract(a).normalize();
  const u=Vector3.Cross(axis,Math.abs(axis.y)>.95?Vector3.Right():Vector3.Up()).normalize();
  const v=Vector3.Cross(axis,u).normalize();
  const base=branches.positions.length/3, sides=10, rings=5;
  const control=a.add(initial.scale(Vector3.Distance(a,b)*.48));
  for(let ring=0;ring<rings;ring++) for(let i=0;i<sides;i++){
   const f=ring/(rings-1),t=i/sides*Math.PI*2;
   const center=a.scale((1-f)*(1-f)).add(control.scale(2*f*(1-f))).add(b.scale(f*f));
   const r=(r0+(r1-r0)*f)*(1+Math.sin(i*3.7)*.045);
   const p=center.add(u.scale(Math.cos(t)*r)).add(v.scale(Math.sin(t)*r));
   branches.positions.push(p.x,p.y,p.z);branches.uvs.push(i/sides,f);
   const shade=.92+random()*.16;
   branches.colors.push(.23*shade,.20*shade,.15*shade,1);
  }
  for(let ring=0;ring<rings-1;ring++)for(let i=0;i<sides;i++){
   const j=(i+1)%sides,o=base+ring*sides;
   branches.indices.push(o+i,o+j,o+sides+i,o+j,o+sides+j,o+sides+i);
  }
 }
 function leaf(p,size){
  const n=new Vector3(random()-.5,random()*.8-.1,random()-.5).normalize();
  const u=Vector3.Cross(n,Vector3.Up()).normalize(),v=Vector3.Cross(n,u);
  const base=leaves.positions.length/3;
  const hue=random(), shade=.68+random()*.35;
  const rgb=[(.76+hue*.21)*shade,(.47+hue*.28)*shade,.025+random()*.045];
  leaves.positions.push(p.x,p.y,p.z); leaves.colors.push(...rgb,1);leaves.uvs.push(0,0);
  for(let j=0;j<=8;j++){
   const angle=-1.16+j/8*2.32;
   let length=size*(.94+random()*.1);
   if(j===4)length*=.82; // small split at the fan's edge
   const q=p.add(u.scale(Math.sin(angle)*length)).add(v.scale(Math.cos(angle)*length));
   q.y+=Math.sin(j/8*Math.PI)*size*.12;
   leaves.positions.push(q.x,q.y,q.z);leaves.uvs.push(Math.sin(angle),Math.cos(angle));
   leaves.colors.push(rgb[0]*(j%2?.96:1),rgb[1],rgb[2],1);
  }
  for(let j=0;j<8;j++)leaves.indices.push(base,base+j+1,base+j+2);
 }
 function branch(a,dir,length,radius,depth,initial=dir){
  const b=a.add(dir.scale(length)); tube(a,b,radius,radius*.57,initial);
  if(depth<=1){
   const count=depth===0?65:20;
   for(let k=0;k<count;k++){
    const p=Vector3.Lerp(a,b,random()).add(new Vector3((random()-.5)*1.9,(random()-.5)*1.25,(random()-.5)*1.9));
    leaf(p,.13+random()*.14);
   }
  }
  if(depth===0)return;
  const count=depth===4?4:3;
  for(let k=0;k<count;k++){
   const angle=random()*Math.PI*2;
   const spread=depth===4?.65:.85;
   const child=dir.scale(.65).add(new Vector3(Math.cos(angle)*spread,.18+random()*.35,Math.sin(angle)*spread)).normalize();
   const start=Vector3.Lerp(a,b,k===0?1:.72+random()*.28);
   branch(start,child,length*(.56+random()*.15),radius*(k===0?.57:.38),depth-1,dir);
  }
 }
 for(let row=0;row<5;row++) for(const side of [-1,1]){
  const x=side*(5.2+random()*1.5),z=-7+row*8+random()*2;
  branch(new Vector3(x,-1,z),new Vector3(-side*.13,1,.03).normalize(),6+random()*1.4,.42+random()*.14,4);
 }
 function meshFrom(name,data,foliage){
  const mesh=new Mesh(name,scene),vd=new VertexData();
  vd.positions=data.positions;vd.indices=data.indices;vd.colors=data.colors;vd.uvs=data.uvs;vd.normals=[];
  VertexData.ComputeNormals(vd.positions,vd.indices,vd.normals);vd.applyToMesh(mesh);
  const mat=new ShaderMaterial(name,scene,'ginkgo',{attributes:['position','normal','color','uv'],uniforms:['worldViewProjection','time','foliage']});
  mat.backFaceCulling=false;mat.setFloat('foliage',foliage);mat.setFloat('time',0);mesh.material=mat;
  return mat;
 }
 meshFrom('branches',branches,0);
 const leafMaterial=meshFrom('fan-shaped ginkgo leaves',leaves,1);
 return {scene,update(time,look){leafMaterial.setFloat('time',time);camera.setTarget(new Vector3(look.x*8,14+look.y*7,6));}};
}
