export async function handle({ event, resolve }) {
    const pathname = new URL(event.request.url).pathname;

    let limiter: any;

    try {
        // @ts-ignore
        limiter = MY_RATE_LIMITER;
    } catch {
        limiter = null;
    }

    if (limiter && typeof limiter.limit === 'function') {
        const { success } = await limiter.limit({ key: pathname });

        if (!success) {
            return new Response(`429 Failure – rate limit exceeded for ${pathname}`, {
                status: 429,
            });
        }
    }

    return resolve(event);
}