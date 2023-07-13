import * as React from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material';
import { sweetAlert } from "../utils/utils";

export function useBlocker(blocker, when = true) {
    const { navigator } = React.useContext(NavigationContext);

    React.useEffect(() => {
        if (!when) return;
        console.log(navigator);
        if (navigator) {
            const unblock = navigator.block((tx) => blocker({
                ...tx,
                retry() {
                    unblock();
                    tx.retry();
                },
            }));

            return unblock;
        }
    }, [navigator, blocker, when]);
}

export default function usePrompt(message, when = true) {
    const { palette } = useTheme();
    const errorColor = palette.error.main;
    const primaryColor = palette.primary.main;
    const blocker = React.useCallback(
        (tx) => {
            sweetAlert({
                title: 'Cảnh báo chuyển trang',
                text: message,
                icon: 'warning',
                confirmColor: primaryColor,
                cancelColor: errorColor,
            })
                .then(result => {
                    if (result.isConfirmed) {
                        tx.retry();
                    }
                });

        },
        [message]
    );

    useBlocker(blocker, when);
}