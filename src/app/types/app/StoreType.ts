import { InternalStateType } from './InternalStateType';

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

export {
    StoreType
};
