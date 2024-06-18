import Button from '@/components/Button/Button';
import { useDaumPostcodePopup } from 'react-daum-postcode';

export default function Postcode(props) {
    const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

    const handleComplete = (data, e) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        document.querySelector('#postcode').value = data.zonecode; // 우편번호 (5자리)
        document.querySelector('#address').value = fullAddress; // 주소
        // document.querySelector('#addressDetail').focus(); // 상세주소

    };

    const handleClick = (e) => {
        open({ onComplete: handleComplete });
    };

    return (
        <>
            <Button variantStyle="white" sizeStyle="sm" onClick={() => handleClick()}>주소 검색</Button>
        </>
    );
};