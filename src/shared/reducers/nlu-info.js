import { handleActions } from 'relient/reducers';
import {
  READ_ALL,
} from '../actions/nlu-info';
// import { nluInfo } from '../schema';

export default {
  nluInfo: handleActions({
    [READ_ALL]: (nluInfo, { payload }) => (payload.productSkillInfos),

    // [READ_INFO]: (intentMapInfo, { payload }) => ({
    //   intentMapNames: payload.data.intentMapNames,
    //   skillInfos: payload.data.skillInfos,
    // }),

  }, {}),
};
