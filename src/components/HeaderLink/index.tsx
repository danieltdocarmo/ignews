import { useRouter } from "next/dist/client/router";
import Link, { LinkProps } from "next/link";
import React, { cloneElement, ReactElement } from "react";

interface LinkRequest extends LinkProps{
    children: ReactElement;
    activeClassName: string;
}

export function HeaderLink({children, activeClassName, ...rest}: LinkRequest){
    const asPath = useRouter();


    const className = asPath.route === rest.href ? activeClassName : '';
    


    return(
        <Link {...rest}>
            {cloneElement(children, { className })}
        </Link>
    );
}