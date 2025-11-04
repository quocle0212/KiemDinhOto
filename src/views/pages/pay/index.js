import React from "react";  
import { useHistory, useLocation } from "react-router-dom";
import { Card } from "reactstrap";
import BasicTab from "../../components/BasicTab/BasicTab";
import StationPayment from "./StationPayment";
import PaymentMethod from "./PaymentMethod";

export default function Pay() {
  const location = useLocation();
    const history = useHistory();
    
    // Lấy tham số truy vấn "tab" từ URL
    const queryParams = new URLSearchParams(location.search);
    const defaultTab = queryParams.get('tab') || '1';  // Mặc định là '1' nếu không có tham số truy vấn

    const tabs = [
        {
            id: '1',
            title: <span>Phương thức thanh toán trung tâm</span>,
            content: <StationPayment />,
        },
        {
            id: '2',
            title: <span>Phương thức thanh toán hệ thống</span>,
            content: <PaymentMethod />,
        },
    ];

    // Xử lý sự thay đổi tab và cập nhật tham số truy vấn trong URL
    const handleTabChange = (key) => {
        history.push(`?tab=${key}`);
    };

    return (
        <Card style={{ padding: 20 }}>
            <BasicTab onChangeMore={handleTabChange} defaultTab={defaultTab} tabs={tabs} />
        </Card>
    );
}