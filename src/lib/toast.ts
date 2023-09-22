import { toast } from "@zerodevx/svelte-toast";

export const error = (message: string) => toast.push(message, {
    theme: {
        "--toastBackground": "#f87272"
    }
});

export const success = (message: string) => toast.push(message, {
    theme: {
        "--toastBackground": "#36d399"
    }
});