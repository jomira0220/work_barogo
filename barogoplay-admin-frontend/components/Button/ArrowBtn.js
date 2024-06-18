import style from "styled-components";

export default function ArrowBtn({ type, className, onClick }) {

  const Button = style.button`
  width: 30px;
  height: 30px;
  background-image: url("/images/bgicon.png");
  background-repeat: no-repeat;
  background-size: 300px auto;
  overflow: visible;
  &.prev {
    background-position: -235px -94px;
    .on {
      background-position: -235px -128px;
    }
  }
  &.next {
    background-position: -269px -94px;
    .on{
      background-position: -269px -128px;
    }
  }
  `;

  if (type === "prev") {
    return (
      <Button className={`prev ${className}`} onClick={onClick}></Button>
    )
  } else if (type === "next") {
    return (
      <Button className={`next ${className}`} onClick={onClick}></Button>
    )
  }
}