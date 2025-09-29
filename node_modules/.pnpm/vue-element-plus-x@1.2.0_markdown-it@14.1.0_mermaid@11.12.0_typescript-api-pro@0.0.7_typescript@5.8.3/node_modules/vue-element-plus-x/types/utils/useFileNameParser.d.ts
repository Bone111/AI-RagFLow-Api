import { Ref } from 'vue';
export default function useFileNameParser(name: Ref<string | undefined>): {
    namePrefix: globalThis.ComputedRef<string>;
    nameSuffix: globalThis.ComputedRef<string>;
};
