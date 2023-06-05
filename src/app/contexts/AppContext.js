import React, { useState } from 'react'
import useFirestore from '../hooks/useFirestore';
import useAuth from '../hooks/useAuth';

export const AppContext = React.createContext({})

export const AppProvider = ({ children }) => {
    /* const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false); */

    const { user } = useAuth();
    if (user) {
        const [selectedRoomId, setSelectedRoomId] = useState('');

        const notifyCondition = React.useMemo(
            () => ({
                fieldName: 'receivedId',
                operator: 'array-contains',
                compareValue: user.id,
            }),
            [user.id]
        );
        const notifications = useFirestore('notifications', notifyCondition, true);

        const roomsCondition = React.useMemo(() => {
            return {
                fieldName: 'staffs',
                operator: 'array-contains',
                compareValue: user.id,
            };
        }, [user.id]);
        const rooms = useFirestore('rooms', roomsCondition);

        const selectedRoom = React.useMemo(
            () => rooms.find((room) => room.id === selectedRoomId) || {},
            [rooms, selectedRoomId]
        );

        /* const usersCondition = React.useMemo(() => {
            return {
                fieldName: 'id',
                operator: 'in',
                compareValue: selectedRoom.staffs,
            };
        }, [selectedRoom.staffs]);

        const staffs = useFirestore('users', usersCondition); */

        const clearState = () => {
            setSelectedRoomId('');
            /* setIsAddRoomVisible(false);
            setIsInviteMemberVisible(false); */
        };
        return (
            <AppContext.Provider
                value={{
                    rooms,
                    notifications,
                    /* staffs, */
                    selectedRoom,
                    /* isAddRoomVisible,
                    setIsAddRoomVisible, */
                    selectedRoomId,
                    setSelectedRoomId,
                    /* isInviteMemberVisible,
                    setIsInviteMemberVisible, */
                    clearState,
                }}
            >
                {children}
            </AppContext.Provider>
        );
    } else {
        return (
            <AppContext.Provider>
                {children}
            </AppContext.Provider>
        )
    }


}
