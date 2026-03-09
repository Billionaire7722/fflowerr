import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dl5r1lat2',
      api_key: '976772572287884',
      api_secret: 'wnk2FQpjK7AobKFiVTaract-qo8',
    });
  },
};
