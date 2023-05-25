import React from 'react';
import { getFetchInstance } from '../ofetch-instance';
import debounce from 'lodash.debounce';

type MapFn<A> = (value: A, index: number, array: A[]) => A;

export function useData<T>(path: string, mapFn?: MapFn<T>): Partial<T>[] {

    const [oFetch] = React.useState(() => {
        return debounce(getFetchInstance(), 250, { leading: true, trailing: false });
    });

    const [theData, setData] = React.useState<T[]>([{} as T]);

    React.useEffect(() => {
        (async () => {
            const data = await oFetch(path);

            if (Array.isArray(data)) {
                if (mapFn) {
                    setData(data.map(mapFn));
                } else {
                    setData(data);
                }
            }
        })();
    }, []);

    return theData;
}

