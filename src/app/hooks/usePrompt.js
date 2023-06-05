import * as React from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import swal from 'sweetalert';

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
    const blocker = React.useCallback(
        (tx) => {
            swal({
                title: "Cảnh báo chuyển trang",
                text: message,
                icon: "warning",
                buttons: ["Hủy bỏ", "Đồng ý"],
            })
                .then(result => {
                    if (result) {
                        tx.retry();
                    }
                });
        },
        [message]
    );

    useBlocker(blocker, when);
}