import { RequestMethod } from '@nestjs/common';

type HttpMethod = keyof typeof RequestMethod;
export { HttpMethod };
