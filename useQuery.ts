import {
    QueryKey,
    useMutation,
    UseMutationOptions,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from 'react-query';
import useErrorHandler from './useErrorHandler';
import { queryClient } from '../../../pages/_app';

export const useMutate = <
    T extends any = unknown,
    R = unknown,
    TError = { response: { data: any } },
    TSnapshot = unknown
>(
    fetcher: (args: T) => Promise<R>,
    config?: UseMutationOptions<R, TError, T, TSnapshot>
) => {
    const { ...mutateOptions } = useMutation((args: T) => fetcher(args), {
        ...config,
    });

    return {
        ...mutateOptions,
    };
};

export const refetchQueries = (fns: string | string[]) => {
    if (!Array.isArray(fns)) {
        //@ts-ignore
        queryClient.refetchQueries(fns, { active: true });
    } else {
        fns.forEach((fn) => {
            queryClient.refetchQueries(fn, { active: true });
        });
    }
};
export const useGet = <T extends any[], R>(
    fetcher: (...args: T) => Promise<R>,
    fetcherName: string,
    config?: UseQueryOptions<R, { response: { data: { message: string } } }>,
    ...args: Parameters<typeof fetcher>
): UseQueryResult<R> => {
    const errHandler = useErrorHandler();
    return {
        ...useQuery(
            [
                fetcherName,
                typeof args === 'string' ? args : args?.[0],
            ] as QueryKey,
            () => fetcher(...args),
            {
                onError(e: any) {
                    errHandler(e.response.data);
                },
                ...config,
            }
        ),
    };
};
