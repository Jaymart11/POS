import { Row, Tabs } from "antd";
import { useCategoryData } from "../../hooks/useCategoryData";
import { useState } from "react";
import { useProductData } from "../../hooks/useProductData";
import MenuListItem from "./MenuListItem";

const MenuList = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const { data: catData } = useCategoryData();
  const { data: prodData } = useProductData(currentCategory);

  const handleCategoryChange = (key) => {
    setCurrentCategory(key);
  };

  return (
    <>
      <Tabs
        onChange={handleCategoryChange}
        items={[
          { label: "All", key: 0 },
          ...(catData
            ? catData.map(({ id, name }) => ({ label: name, key: id }))
            : []),
        ]}
      />
      <div
        style={{
          height: "90vh",
          overflowX: "hidden",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          padding: "10px",
        }}
      >
        <Row gutter={[16, 16]}>
          {prodData?.map((prod) => (
            <MenuListItem key={prod.id} item={prod} prod={prodData} />
          ))}
        </Row>
      </div>
    </>
  );
};

export default MenuList;
