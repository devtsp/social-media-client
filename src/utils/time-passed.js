export function timePassed(time) {
	const old = new Date(time);
	const now = new Date();
	const diff = now - old;
	const msInHrs = 1000 * 60 * 60;
	const msInMn = 1000 * 60;
	const hrs = Math.floor(diff / msInHrs);
	const mn = Math.floor(diff / msInMn);
	return hrs < 1
		? mn < 1
			? `Less than a minute ago`
			: mn === 1
			? `1 minute ago`
			: `${mn} minutes ago`
		: hrs < 24
		? `${hrs} hours ago`
		: `${Math.floor(hrs / 24)} days ago`;
}
