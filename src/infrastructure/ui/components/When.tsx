import React from "react";

export interface IWhenProps {
  predicate: boolean;
  children: React.ReactNode;
}

export const When = (props: IWhenProps) => {
  return props.predicate ? <>{props.children}</> : <></>;
};
