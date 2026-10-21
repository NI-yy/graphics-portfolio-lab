import { createGinkgoScene } from './createGinkgoScene';
import { Color4, Effect, Engine, FreeCamera, PostProcess, Scene, Vector2, Vector3 } from '@babylonjs/core';

// The view is traced from procedural height fields; no photographic scene texture is sampled.
Effect.ShadersStore.landscapeFragmentShader = `
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 resolution, look;
uniform float time, mode;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p) {
  float a=0.5, v=0.0;
  for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+13.7;a*=0.5;}
  return v;
}
vec3 sunDir(){return normalize(vec3(0.59,0.34,0.73));}
vec3 sky(vec3 d){
  float h=max(d.y,0.0);
  vec3 horizon=mode<0.5?vec3(0.70,0.78,0.76):vec3(0.75,0.81,0.76);
  vec3 zenith=mode<0.5?vec3(0.11,0.33,0.49):vec3(0.20,0.42,0.57);
  vec3 col=mix(horizon,zenith,pow(h,0.53));
  float sd=max(dot(d,sunDir()),0.0);
  col+=vec3(1.0,0.63,0.30)*pow(sd,16.0)*0.30;
  col+=vec3(1.0,0.88,0.67)*pow(sd,520.0)*2.4;
  if(d.y>0.018){
    vec2 cp=d.xz/max(d.y+0.12,0.16)*1.45+vec2(time*0.009,time*0.003);
    float shape=fbm(cp*0.72)*0.70+fbm(cp*1.7+7.0)*0.30;
    float cloud=smoothstep(0.54,0.68,shape)*smoothstep(0.015,0.15,d.y);
    vec3 shade=mix(vec3(0.65,0.72,0.72),vec3(0.99,0.96,0.89),
      clamp(shape*1.6-0.3+sd*0.28,0.0,1.0));
    col=mix(col,shade,cloud*0.85);
  }
  return col;
}
float seaHeight(vec2 p){
  return 0.100*sin(dot(p,vec2(0.30,0.22))-time*0.70)
       + 0.064*sin(dot(p,vec2(-0.48,0.37))+time*0.86)
       + 0.027*sin(dot(p,vec2(1.37,0.85))-time*1.46)
       + 0.013*sin(dot(p,vec2(-2.82,1.41))+time*1.94);
}
vec3 seaNormal(vec2 p,float dist){
  float e=mix(0.03,0.24,clamp(dist/120.0,0.0,1.0));
  return normalize(vec3(seaHeight(p-vec2(e,0))-seaHeight(p+vec2(e,0)),
                        2.0*e,seaHeight(p-vec2(0,e))-seaHeight(p+vec2(0,e))));
}
float terrainHeight(vec2 p){
  return -0.75+0.55*sin(p.x*0.055+0.3)+0.42*sin(p.y*0.036)
    +(fbm(p*0.026+7.0)-0.47)*2.0+(fbm(p*0.21)-0.5)*0.17;
}
vec3 terrainNormal(vec2 p){
  float e=0.10;
  return normalize(vec3(terrainHeight(p-vec2(e,0))-terrainHeight(p+vec2(e,0)),
                        2.0*e,terrainHeight(p-vec2(0,e))-terrainHeight(p+vec2(0,e))));
}
vec3 distantHills(vec3 d,vec3 base){
  float bearing=atan(d.x,d.z);
  float ridge=0.011+0.024*sin(bearing*4.2+1.0)
    +0.013*sin(bearing*9.4)+0.007*sin(bearing*21.0);
  float hill=1.0-smoothstep(ridge-0.004,ridge+0.004,d.y);
  return mix(base,vec3(0.30,0.45,0.42),hill*0.82);
}
vec3 traceSea(vec3 ro,vec3 rd){
  vec3 air=sky(rd);
  if(rd.y>-0.003)return air;
  float t=clamp(-ro.y/rd.y,0.0,220.0);
  for(int i=0;i<5;i++){
    vec3 q=ro+rd*t;
    t=clamp((seaHeight(q.xz)-ro.y)/rd.y,0.0,220.0);
  }
  vec3 p=ro+rd*t, n=seaNormal(p.xz,t);
  vec3 reflected=reflect(rd,n);
  float ndv=clamp(dot(n,-rd),0.0,1.0);
  float fresnel=0.022+0.978*pow(1.0-ndv,5.0);
  vec3 deep=mix(vec3(0.012,0.102,0.132),vec3(0.034,0.188,0.197),
    fbm(p.xz*0.052+time*0.014));
  vec3 col=mix(deep,sky(reflected),fresnel*0.88+0.07);
  float glitter=pow(max(dot(reflect(-sunDir(),n),-rd),0.0),170.0);
  col+=vec3(1.0,0.78,0.48)*glitter*2.1;
  float cap=smoothstep(0.73,0.90,fbm(p.xz*1.6+time*0.12));
  col+=vec3(0.14,0.24,0.23)*cap*(1.0-smoothstep(12.0,110.0,t))*0.26;
  return mix(col,air,smoothstep(35.0,200.0,t)*0.52);
}
vec3 traceField(vec3 ro,vec3 rd){
  vec3 air=distantHills(rd,sky(rd));
  if(rd.y>0.07)return air;
  float t=clamp((terrainHeight(ro.xz+rd.xz*20.0)-ro.y)/min(rd.y,-0.008),0.0,210.0);
  for(int i=0;i<8;i++){
    vec3 q=ro+rd*t;
    t=clamp(t+(terrainHeight(q.xz)-q.y)/min(rd.y,-0.025)*0.62,0.0,210.0);
  }
  vec3 p=ro+rd*t;
  if(t>=209.0||abs(p.y-terrainHeight(p.xz))>0.45)return air;
  vec3 n=terrainNormal(p.xz);
  float vegetation=fbm(p.xz*0.56), fine=noise(p.xz*7.2);
  vec3 grass=mix(vec3(0.16,0.27,0.13),vec3(0.42,0.48,0.20),
    clamp(vegetation*1.25+fine*0.20,0.0,1.0));
  grass*=0.52+0.72*max(dot(n,sunDir()),0.0);
  float wind=sin(p.x*0.58+p.z*0.34+time*1.2);
  float stems=pow(noise(p.xz*12.0+vec2(wind*0.09,0.0)),5.0);
  grass+=vec3(0.18,0.19,0.06)*stems*(1.0-smoothstep(15.0,65.0,t));
  float flower=step(0.994,hash(floor(p.xz*4.0)))*(1.0-smoothstep(8.0,45.0,t));
  grass=mix(grass,vec3(0.92,0.81,0.52),flower*0.75);
  return mix(grass,air,smoothstep(30.0,175.0,t)*0.74);
}
void main(void){
  vec2 uv=(gl_FragCoord.xy-0.5*resolution)/resolution.y;
  vec3 rd=normalize(vec3(uv*1.35,1.0));
  float yaw=look.x*0.62, pitch=-0.045-look.y*0.32;
  rd.yz=mat2(cos(pitch),-sin(pitch),sin(pitch),cos(pitch))*rd.yz;
  rd.xz=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw))*rd.xz;
  vec3 ro=mode<0.5?vec3(0.0,1.6,-3.0):vec3(0.0,1.85,-3.0);
  vec3 col=mode<0.5?traceSea(ro,rd):traceField(ro,rd);
  col=pow(col/(col+vec3(0.30)),vec3(0.88));
  float vignette=1.0-0.22*dot(uv*vec2(0.68,0.85),uv*vec2(0.68,0.85));
  gl_FragColor=vec4(col*vignette,1.0);
}`;

export function createLandscape(canvas) {
  const engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:false});
  engine.setHardwareScalingLevel(Math.max(1,Math.min(2,window.devicePixelRatio/1.3)));
  const scene=new Scene(engine);
  scene.clearColor=new Color4(0,0,0,1);
  const camera=new FreeCamera('ray tracing camera',new Vector3(0,0,-1),scene);
  camera.setTarget(Vector3.Zero());
  scene.activeCamera=camera;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let selectedMode='ginkgo', active=true, pointer=null, paused=false, elapsed=0;
  let ginkgo=null;
  const look={x:0,y:0};
  const post=new PostProcess('procedural landscape','landscape',
    ['resolution','look','time','mode'],[],1,camera);
  post.onApply=(effect)=>{
    effect.setVector2('resolution',new Vector2(engine.getRenderWidth(),engine.getRenderHeight()));
    effect.setVector2('look',new Vector2(look.x,look.y));
    effect.setFloat('time',elapsed);
    effect.setFloat('mode',selectedMode==='meadow'?1:0);
  };
  const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;},{threshold:0.01});
  observer.observe(canvas);
  const onVisibility=()=>{active=!document.hidden;};
  const onResize=()=>engine.resize();
  const onPointerDown=(event)=>{canvas.setPointerCapture(event.pointerId);pointer={x:event.clientX,y:event.clientY};};
  const onPointerMove=(event)=>{
    if(!pointer)return;
    look.x=Math.max(-1,Math.min(1,look.x+(event.clientX-pointer.x)/650));
    look.y=Math.max(-1,Math.min(1,look.y+(event.clientY-pointer.y)/650));
    pointer={x:event.clientX,y:event.clientY};
  };
  const onPointerUp=()=>{pointer=null;};
  const resizeObserver=new ResizeObserver(onResize);
  resizeObserver.observe(canvas);
  document.addEventListener('visibilitychange',onVisibility);
  canvas.addEventListener('pointerdown',onPointerDown);
  window.addEventListener('pointermove',onPointerMove);
  window.addEventListener('pointerup',onPointerUp);
  canvas.addEventListener('pointercancel',onPointerUp);
  engine.runRenderLoop(()=>{
    if(!active || document.hidden)return;
    if(!paused && !reducedMotion)elapsed+=Math.min(engine.getDeltaTime(),50)*.001;
    if(selectedMode==='ginkgo'){
      if(!ginkgo)ginkgo=createGinkgoScene(engine);
      ginkgo.update(elapsed,look);ginkgo.scene.render();
    }else scene.render();
  });
  return {
    setMode(nextMode){selectedMode=nextMode;look.x=0;look.y=0;},
    setPaused(value){paused=value;},
    dispose(){
      resizeObserver.disconnect();observer.disconnect();
      document.removeEventListener('visibilitychange',onVisibility);
      canvas.removeEventListener('pointerdown',onPointerDown);
      window.removeEventListener('pointermove',onPointerMove);
      window.removeEventListener('pointerup',onPointerUp);
      canvas.removeEventListener('pointercancel',onPointerUp);
      engine.stopRenderLoop();ginkgo?.scene.dispose();scene.dispose();engine.dispose();
    },
  };
}
