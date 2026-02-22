import uabMetadata from './posts/uab/metadata.js';
import uabContent from './posts/uab/content.js';

import upcMetadata from './posts/upc/metadata.js';
import upcContent from './posts/upc/content.js';

import ucmMetadata from './posts/ucm/metadata.js';
import ucmContent from './posts/ucm/content.js';

import usMetadata from './posts/us/metadata.js';
import usContent from './posts/us/content.js';

import ugrMetadata from './posts/ugr/metadata.js';
import ugrContent from './posts/ugr/content.js';

export const blogPosts = [
  {
    ...uabMetadata,
    content: uabContent
  },
  {
    ...upcMetadata,
    content: upcContent
  },
  {
    ...ucmMetadata,
    content: ucmContent
  },
  {
    ...usMetadata,
    content: usContent
  },
  {
    ...ugrMetadata,
    content: ugrContent
  }
];