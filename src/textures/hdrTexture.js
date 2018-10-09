import { RGBEEncoding, NearestFilter, DataTexture } from 'three';
import { RGBELoader } from '../examples/RGBELoader';

export const HDRTexture = new DataTexture();

const loader = new RGBELoader();
loader.load(
  'images/venetian_crossroads_1k.hdr',
  tex => {
    console.log('tex=', tex);
    tex.encoding = RGBEEncoding;
    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;
    tex.flipY = true;
    HDRTexture.copy(tex);
    HDRTexture.needsUpdate = true;
  }
)
