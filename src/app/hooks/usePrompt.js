import * as React from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import swal from 'sweetalert';

export function useBlocker(blocker, when = true) {
    const { navigator } = React.useContext(NavigationContext);

    React.useEffect(() => {
        if (!when) return;

        const unblock = navigator.block((tx) => {
        const autoUnblockingTx = {
            ...tx,
            retry() {
                unblock();
                tx.retry();
            },
        };

        blocker(autoUnblockingTx);
        });

        return unblock;
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