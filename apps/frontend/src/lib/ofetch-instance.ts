import { useAppStore } from './zustand/app-store';
import { ofetch, FetchOptions } from 'ofetch';

function endpoint() {
      if (typeof window !== 'undefined') {
            if (window.location.host.includes('frontend')) {
                  return 'http://backend:3333/nest';
            }

            return `${window.location.protocol}//${window.location.host}/nest`;
      } else {
            return 'http://backend:3333/nest';
      }
}


export const getFetchInstance = (opts?: FetchOptions) => {
      opts = opts || {};

      if (typeof window !== 'undefined') {
            opts = {
                  ...opts,
                  onRequestError(context) {
                        const { setLoading } = useAppStore.getState();
                        setLoading(false);

                        const { error } = context;
                        throw new Error(error?.message);
                  },
                  onResponseError(context) {
                        const { setLoading } = useAppStore.getState();
                        setLoading(false);


                        const { error } = context;
                        throw new Error(error?.message);
                  }
            };
      }

      const instance = ofetch.create({
            ...opts,
            baseURL: opts.baseURL || endpoint(),
            credentials: opts.credentials || 'include',
      });

      return instance;
};