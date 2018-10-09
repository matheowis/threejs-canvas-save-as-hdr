import {ShaderMaterial} from 'three';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';
import {HDRTexture} from '../textures/hdrTexture'

export const sphereMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms:{
    tDiffuse:{value:HDRTexture}
  },
  transparent:true
})