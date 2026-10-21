import { Scene, FreeCamera, Vector3, Color4, Mesh, MeshBuilder, VertexData, ShaderMaterial, Effect, Texture } from '@babylonjs/core';
import leafImage from './img/ginkgo-leaf.png';
import barkImage from './img/ginkgo-bark.png';

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
 float canopy=clamp((p.y-7.)/10.,0.,1.);
 float sway=sin(time*.68+p.x*.36+p.z*.22)*.055+sin(time*1.28+p.y*.8+p.z*.8)*.035;
 p.x+=sway*foliage*canopy; p.z+=sway*.55*foliage*canopy;
 vPosition=p;vNormal=normal;vColor=color;vUV=uv;
 gl_Position=worldViewProjection*vec4(p,1.);
}`;
Effect.ShadersStore.ginkgoFragmentShader = `
precision highp float;
varying vec3 vPosition, vNormal;
varying vec4 vColor;
varying vec2 vUV;
uniform float foliage;
uniform sampler2D leafTexture;
uniform sampler2D barkTexture;
void main(){
 vec3 n=normalize(vNormal);
 vec3 sun=normalize(vec3(-.42,.79,.44));
 float facing=dot(n,sun);
 vec3 c=vColor.rgb;
 if(foliage>.5){
   vec4 leaf=texture2D(leafTexture,vUV);
   if(leaf.a<.48)discard;
   c*=leaf.rgb;
   float cluster=sin(vPosition.x*.87+vPosition.z*.42)*sin(vPosition.z*.8-vPosition.y*.66);
   float diffuse=.51+.28*max(facing,0.)+.16*max(-facing,0.);
   float translucency=pow(max(-facing,0.),1.8)*.22;
   c*=diffuse+translucency+cluster*.09;
   c+=vec3(.13,.11,.025)*translucency;
   float towardSun=max(dot(normalize(vPosition-vec3(0.,1.8,-1.)),sun),0.);
   c+=vec3(.24,.18,.025)*pow(towardSun,12.);
 }else{
   vec3 bark=texture2D(barkTexture,vec2(vUV.x,vUV.y*.35)).rgb;
   c*=bark*(.66+.43*max(facing,0.));
 }
 float fog=1.-exp(-length(vPosition)*.0025);
 c=mix(c,vec3(.77,.80,.72),fog);
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
 vec3 col=mix(vec3(.92,.94,.94),vec3(.47,.65,.82),pow(max(d.y,0.),.75));
 vec2 p=d.xz/max(d.y,.15)*2.;
 float cloud=noise(p*.65)*.53+noise(p*1.8)*.32+noise(p*5.1)*.15;
 col=mix(col,vec3(.98,.98,.97),smoothstep(.52,.74,cloud)*.78);
 float sun=max(dot(d,normalize(vec3(-.42,.79,.44))),0.);
 col+=vec3(1.,.94,.77)*pow(sun,75.)*.34;
 col+=vec3(1.)*pow(sun,430.)*.8;
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
 const density=engine.getRenderWidth()<700?.58:1;
 let treeTint=0;
 const branches={positions:[],indices:[],colors:[],uvs:[]}, leaves={positions:[],indices:[],colors:[],uvs:[]};
 function tube(a,b,r0,r1,initial,sides=10){
  const axis=b.subtract(a).normalize();
  const base=branches.positions.length/3, rings=r0<.025?3:7;
  const control=a.add(initial.scale(Vector3.Distance(a,b)*.51));
  for(let ring=0;ring<rings;ring++) for(let i=0;i<sides;i++){
   const f=ring/(rings-1),t=i/sides*Math.PI*2;
   const center=a.scale((1-f)*(1-f)).add(control.scale(2*f*(1-f))).add(b.scale(f*f));
   const tangent=control.subtract(a).scale(1-f).add(b.subtract(control).scale(f)).normalize();
   const u=Vector3.Cross(tangent,Math.abs(tangent.y)>.96?Vector3.Right():Vector3.Up()).normalize();
   const v=Vector3.Cross(tangent,u).normalize();
   const r=(r0+(r1-r0)*f)*(1+Math.sin(i*3.7+f*4.)*.035);
   const p=center.add(u.scale(Math.cos(t)*r)).add(v.scale(Math.sin(t)*r));
   branches.positions.push(p.x,p.y,p.z);branches.uvs.push(i/sides,f*Vector3.Distance(a,b));
   const shade=.84+random()*.16;
   branches.colors.push(.93*shade,.91*shade,.87*shade,1);
  }
  for(let ring=0;ring<rings-1;ring++)for(let i=0;i<sides;i++){
   const j=(i+1)%sides,o=base+ring*sides;
   branches.indices.push(o+i,o+j,o+sides+i,o+j,o+sides+j,o+sides+i);
  }
 }
 function leaf(p,size){
  const n=new Vector3(random()-.5,random()*.8-.1,random()-.5).normalize();
  const u=Vector3.Cross(n,Vector3.Up()).normalize(),v=Vector3.Cross(u,n).normalize();
  const base=leaves.positions.length/3;
  const shade=.78+random()*.32;
  const rgb=[shade*(.94+random()*.13),shade*(.91+treeTint),shade*(.77+random()*.19)];
  const width=size*1.9,height=size*1.52;
  const corners=[[-1,0,0,1],[1,0,1,1],[-1,1,0,0],[1,1,1,0]];
  for(const [x,y,uvX,uvY] of corners){
   const q=p.add(u.scale(x*width*.5)).add(v.scale(y*height)).add(n.scale(Math.sin(y*Math.PI)*size*.08));
   leaves.positions.push(q.x,q.y,q.z);leaves.uvs.push(uvX,uvY);
   leaves.colors.push(...rgb,1);
  }
  leaves.indices.push(base,base+1,base+2,base+1,base+3,base+2);
 }
 function branch(a,dir,length,radius,depth,initial=dir){
  const b=a.add(dir.scale(length)); tube(a,b,radius,depth===0?.002:radius*.57,initial);
  if(depth<=1){
   const twigCount=Math.round((depth===0?8:4)*density);
   for(let k=0;k<twigCount;k++){
    const origin=Vector3.Lerp(a,b,.24+random()*.76);
    const direction=dir.scale(.15).add(new Vector3(random()-.5,.1+random()*.45,random()-.5)).normalize();
    const end=origin.add(direction.scale(.5+random()*.5));
    tube(origin,end,.012,.002,direction,5);
    const leafCount=Math.round((depth===0?13:8)*density);
    for(let j=0;j<leafCount;j++){
     const anchor=Vector3.Lerp(origin,end,.18+random()*.85);
     const p=anchor.add(new Vector3((random()-.5)*.24,(random()-.5)*.24,(random()-.5)*.24));
     leaf(p,.11+random()*.105);
    }
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
 for(let row=0;row<6;row++) for(const side of [-1,1]){
  const x=side*(3.9+random()*2.0),z=-7+row*7.5+random()*2;
  treeTint=random()*.10;
  branch(new Vector3(x,-1,z),new Vector3(-side*(.12+random()*.08),1,(random()-.5)*.1).normalize(),6+random()*1.4,.42+random()*.14,4);
 }
 function meshFrom(name,data,foliage){
  const mesh=new Mesh(name,scene),vd=new VertexData();
  vd.positions=data.positions;vd.indices=data.indices;vd.colors=data.colors;vd.uvs=data.uvs;vd.normals=[];
  VertexData.ComputeNormals(vd.positions,vd.indices,vd.normals);vd.applyToMesh(mesh);
  const mat=new ShaderMaterial(name,scene,'ginkgo',{attributes:['position','normal','color','uv'],uniforms:['worldViewProjection','time','foliage'],samplers:['leafTexture','barkTexture']});
  mat.backFaceCulling=false;mat.setFloat('foliage',foliage);mat.setFloat('time',0);mesh.material=mat;
  return mat;
 }
 const texture=new Texture(leafImage,scene,false,false,Texture.BILINEAR_SAMPLINGMODE);
 const barkTexture=new Texture(barkImage,scene,false,false,Texture.TRILINEAR_SAMPLINGMODE);
 barkTexture.wrapU=Texture.WRAP_ADDRESSMODE;
 barkTexture.wrapV=Texture.WRAP_ADDRESSMODE;
 const barkMaterial=meshFrom('branches',branches,0);
 barkMaterial.setTexture('leafTexture',texture);
 barkMaterial.setTexture('barkTexture',barkTexture);
 const leafMaterial=meshFrom('fan-shaped ginkgo leaves',leaves,1);
 leafMaterial.setTexture('leafTexture',texture);
 leafMaterial.setTexture('barkTexture',barkTexture);
 return {scene,update(time,look){leafMaterial.setFloat('time',time);camera.setTarget(new Vector3(look.x*8,14+look.y*7,6));}};
}
