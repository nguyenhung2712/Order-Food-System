import { useEffect, useState } from "react";
import {
  Grid, 
  Chip, Typography, Avatar,
  Box, Divider,
  Tabs, Tab
} from "@mui/material";

import ProductService from "../../../services/product.service";
import { H2, Paragraph, H4, H1 } from "../../../components/Typography";
import { TabPanel, a11yProps } from "../../../components/TabPanel";
import { convertToVND } from "../../../utils/utils";

const ProductInfo = ({ id }) => {

    const [state, setState] = useState({});
    const [tabValue, setTabValue] = useState(0);
    const [imageArr, setImageArr] = useState([]);
    
    useEffect(() => {
        (async () => {
            await ProductService.getProductById(id)
                .then((res) => {
                    let product = res.data.payload;
                    let productImage = product.image.split('|').filter(image => image !== '');
                    if (imageArr.length === 0) {
                        productImage.forEach(image => {
                            setImageArr(curr => [...curr, image]);
                        })
                    }
                    let productIngres = product.ingredients.replaceAll(/[.]/g,"").split(", ");
                    product.ingredients = productIngres;
                    setState(product);
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, []);
    

    const handleChange = (event, newValue) => {
      setTabValue(newValue);
    };

    return (
        <div>
            {
                state.type && 
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        { 
                            imageArr && imageArr.map((image, index) => 
                                <TabPanel 
                                    value={tabValue} index={index} key={index} 
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <img
                                        style={{ border: '5px solid #6a75c9', borderRadius: '10px', 
                                            height: '400px' 
                                        }}
                                        src={ image }
                                        alt="Product Image"
                                    />
                                </TabPanel>
                            )
                        }
                        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
                            <Tabs 
                                value={tabValue} 
                                onChange={handleChange} 
                                sx={{
                                    '.MuiTabs-indicator': {
                                        top: 0,
                                    },
                                }}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs"
                            >
                                { 
                                    imageArr && imageArr.map((image, index) => 
                                        <Tab 
                                            key={index}
                                            sx={{ width: 200 }}
                                            {...a11yProps(index)}
                                            icon={
                                                <Avatar 
                                                    alt="test avatar" 
                                                    src={ image }  
                                                    sx={{
                                                        border: 5,
                                                        height: 150,
                                                        width: '100%'
                                                    }}
                                                />
                                            }
                                        />
                                    )
                                }
                            </Tabs>
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                        <H1 
                            textTransform="capitalize"
                            sx={{
                                marginBottom: 1
                            }}
                        >{ state.dishName }</H1>
                        <Divider />
                        <H4
                            sx={{
                                marginTop: 1,
                                marginBottom: 1
                            }}
                        >Loại: { state.type.typeName }</H4>
                        <H4
                            sx={{
                                marginBottom: 1
                            }}
                        >
                            Tình trạng: 
                            {
                                state.status === 2 
                                ? <Chip label="Tạm ẩn" color="error" size="small" sx={{ marginLeft: 2 }} />
                                : state.status === 0
                                    ? <Chip label="Tạm xóa" size="small" sx={{ marginLeft: 2 }} />
                                    : <Chip label="Có sẵn" color="primary" size="small" sx={{ marginLeft: 2 }} />
                            }   
                        </H4>
                        <Divider />
                        <H4
                            sx={{
                                marginTop: 1,
                                marginBottom: 1
                            }}
                        >Giá bán: { convertToVND(state.price) }</H4>
                        <Divider />
                        <H2
                            sx={{
                                marginTop: 1,
                                marginBottom: 1
                            }}
                        >Nguyên liệu</H2>
                        <ul className="list">
                            {
                                state.ingredients.map((ingre, index) => 
                                    <li 
                                        key={ index }
                                        style={{ 
                                            textTransform: "capitalize",
                                            margin: 5
                                        }}
                                    >{ingre}</li>
                                )
                            }
                        </ul>
                    </Grid>
                </Grid>
            }
        </div>
    );
};

export default ProductInfo;
