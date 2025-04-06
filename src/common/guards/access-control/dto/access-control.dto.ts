import { PickType } from '@nestjs/mapped-types';
import { User } from '@prisma-postgresql/models';

class CanAccessResourcesParams extends PickType(User, ['user_id']) {}

export { CanAccessResourcesParams };
