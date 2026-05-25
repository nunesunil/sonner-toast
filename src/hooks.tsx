import { useEffect, useState } from "react";

export const useIsDocumentHidden = () => {
	const [isDocumentHidden, setIsDocumentHidden] = useState(false);

	useEffect(() => {
		setIsDocumentHidden(document.hidden);
		const callback = () => {
			setIsDocumentHidden(document.hidden);
		};
		document.addEventListener("visibilitychange", callback);
		return () => document.removeEventListener("visibilitychange", callback);
	}, []);

	return isDocumentHidden;
};
