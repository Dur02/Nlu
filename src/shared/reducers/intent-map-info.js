import { handleActions } from 'relient/reducers';
import {
  READ_INFO,
} from '../actions/intent-map';
// import { intentMapInfo } from '../schema';

export default {
  intentMapInfo: handleActions({

    [READ_INFO]: (intentMapInfo, { payload }) => ({
      intentMapNames: payload.data.intentMapNames,
      skillInfos: payload.data.skillInfos,
    }),

  }, {
    intentMapNames: null,
    skillInfos: null,
  }),
};
