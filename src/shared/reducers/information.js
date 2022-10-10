import { handleActions } from 'relient/reducers';
import {
  READ_ALL,
} from '../actions/information';
// import { nluInfo } from '../schema';

export default {
  information: handleActions({
    [READ_ALL]: (information, { payload }) => (payload.productSkillInfos),

    // [READ_INFO]: (intentMapInfo, { payload }) => ({
    //   intentMapNames: payload.data.intentMapNames,
    //   skillInfos: payload.data.skillInfos,
    // }),

  }, {}),
};
