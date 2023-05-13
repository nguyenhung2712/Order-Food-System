import { useState } from "react";
import {
    Grid, List, Card, CardHeader,
    ListItem, ListItemText, ListItemIcon,
    Checkbox, Button, Divider
} from '@mui/material';
import React from 'react';

import { not, intersection, union } from "../utils/utils";

const TransferList = ({ status, left, right, setLeft, setRight }) => {
    const [checked, setChecked] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0 || [0, 3].includes(status)}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} đã chọn`}
            />
            <Divider />
            <List
                sx={{
                    width: "100%",
                    height: 220,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value.name}-label`;

                    return (
                        <ListItem
                            key={value.name}
                            role="listitem"
                            button
                            onClick={[0, 3].includes(status) ? () => { } : handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    disabled={[0, 3].includes(status)}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}

                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.name} />
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <Grid sx={{ padding: "28px 12px" }}
            container spacing={2} justifyContent="center" alignItems="center"
        >
            <Grid item lg={4} md={4} sm={8} xs={12} sx={{ mt: 2 }}>{customList('Quyền còn lại', left)}</Grid>
            <Grid item lg={2} md={4} sm={8} xs={12} sx={{ mt: 2,/*  padding: "0 25px !important" */ }}
                container direction="column" alignItems="center"
            >
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                >
                    &gt;
                </Button>
                <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                >
                    &lt;
                </Button>
            </Grid>
            <Grid item lg={4} md={4} sm={8} xs={12} sx={{ mt: 2/* , padding: "0 0 0 25px !important" */ }}>{customList('Quyền đã cấp', right)}</Grid>
        </Grid>
    );
}

export default TransferList;