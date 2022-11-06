import { useContext } from 'react';
import { UrlContext } from '../contexts/UrlContext';

const useWsUrl = () => {
	return useContext(UrlContext);
};

export default useWsUrl;
