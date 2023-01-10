import { handleActions } from 'relient/reducers';
import {
  READ_CONFIG,
} from '../actions/skill-name-map';
// import { skillNameMapConfig } from '../schema';

export default {
  skillNameMapConfig: handleActions({

    [READ_CONFIG]: (skillNameMapConfig, { payload }) => ({
      apps: payload.data.apps,
      standardSkillNames: payload.data.standardSkillNames,
    }),

  }, {
    apps: null,
    standardSkillNames: null,
  }),
};
