export const tryCatch = async <T>(promise: Promise<T>) => {
    try {
        const data = await promise;
        return { data };
    } catch (error) {
        return { error: error as Error };
    }
};