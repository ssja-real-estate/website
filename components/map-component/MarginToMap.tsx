import React, { FC } from "react";

const MarginToMap: FC<{ mtop: number }> = (props) => {
  console.log(props.mtop);

  return <div style={{ marginTop: props.mtop }}></div>;
};

export default MarginToMap;
