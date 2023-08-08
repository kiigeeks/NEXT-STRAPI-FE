import api from '.'

const ENDPOINT = {
	ACCOUNT: '/accounts',
	LINK: '/links',
	UPLOAD: '/upload'
}

const getAllAccounts = async () => {
	try {
		const accounts = await api.get(ENDPOINT.ACCOUNT);
		return accounts;
	} catch (err) {
		throw Error(err)
	}
}

const getSelectedAccount = async (slug) => {
  try {
		const selectedAccount = await api.get(`${ENDPOINT.ACCOUNT}?filters[slug][$eqi]=${slug}&populate[photo]=*&populate[links][populate]=icon`);
		return selectedAccount;
	} catch (err) {
		return err.response;
	}
}

const updateProfile = async (reqData, paramsId) => {
	try {
		const updatedAccount = await api.put(`${ENDPOINT.ACCOUNT}/${paramsId}`, {data: reqData});
		return updatedAccount;
	} catch (err) {
		return err.response;
	}
}

const authLogin = async (reqData) => {
	try {
		const getAccount = await api.get(`${ENDPOINT.ACCOUNT}?filters[$and][0][slug][$eq]=${reqData.slug}&filters[$and][1][pin][$eq]=${reqData.pin}&populate[photo]=*&populate[links][populate]=icon`);
		return getAccount;
	} catch (err) {
		return err.response;
	}
}

const authRegistrasi = async (reqData) => {
  	try {
		const createdAccount = await api.post(`${ENDPOINT.ACCOUNT}`, {data: reqData});
		return createdAccount;
	} catch (err) {
		return err.response;
	}
}

const uploadImage = async (formData) => {
	try {
		const uploadedImage = await api.post(`${ENDPOINT.UPLOAD}`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
		return uploadedImage;
	} catch (err) {
		return err.response;
	}
}

const addLink = async (reqData) => {
	try {
		const createdLink = await api.post(`${ENDPOINT.LINK}`, {data: reqData});
		return createdLink;
	} catch (err) {
		return err.response;
	}
}

const getAllMyLinks = async (userId) => {
	try {
		const links = await api.get(`${ENDPOINT.LINK}?filters[account][id]=${userId}&populate=*`);
		return links;
	} catch (err) {
		return err.response;
	}
}

const deleteMyLinks = async (paramsId) => {
	try {
		const deletedLink = await api.delete(`${ENDPOINT.LINK}/${paramsId}`);
		return deletedLink;
	} catch (err) {
		return err.response;
	}
}

const updateMyLinks = async (paramsId, reqData) => {
	try {
		const updatedLink = await api.put(`${ENDPOINT.LINK}/${paramsId}`, {data: reqData});
		return updatedLink;
	} catch (err) {
		return err.response;
	}
}

export { getAllAccounts, getSelectedAccount, authLogin, updateProfile, addLink, uploadImage, getAllMyLinks, deleteMyLinks, updateMyLinks, authRegistrasi }