import api from '.'

const ENDPOINT = {
  ACCOUNT: '/accounts'
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
    console.log("error");
  }
}

export { getAllAccounts, getSelectedAccount }