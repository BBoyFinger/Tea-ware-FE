import React, { useEffect } from "react";
type props = {
  url: string;
};
const FacebookPlugin = ({ url }: props) => {
  return (
    <div>
      {/* Plugin Like */}
      <div
        className="fb-like"
        data-href={url}
        data-width=""
        data-layout="standard"
        data-action="like"
        data-size="small"
        data-share="true"
      ></div>

      {/* Plugin Share */}
      <div
        className="fb-share-button"
        data-href={url}
        data-layout="button_count"
      ></div>
    </div>
  );
};

export default FacebookPlugin;
