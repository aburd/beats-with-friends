import { useTransContext } from "@mbarzda/solid-i18next";

const useTranslation = () => {
    const t = (key: string) => {
        const [t] = useTransContext();
        return t(key) as string;
    }

    return t;
}

export default useTranslation;