import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Actions } from './casl-ability.const';

@Injectable()
export class CaslAbilityFactory {
  getActions() {
    const { MANAGE, ...remainActions } = Actions;
    return Object.values(remainActions);
  }
  defineAbility(
    permissions: {
      __typename: string;
      actions: string[];
    }[]
  ) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    for (const { __typename, actions } of permissions) {
      can(actions, __typename);
    }
    return build({
      detectSubjectType: (object) => object.__typename,
    });
  }
}
