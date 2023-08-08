import { useRouter } from 'next/router';

export const useAuth = () => {
    const router = useRouter();

    const setToken = (data) => {
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/dashboard');
    }

    const logout = () => {
        localStorage.removeItem('user');
        router.push('/auth/signin');
    }

    const getMe = () => {
        const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
        if (!userFromLocalStorage) {
            router.push("/")
            return false
        }

        return userFromLocalStorage
    }

    return { setToken, logout, getMe }
}
