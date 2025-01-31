import React, { useEffect, useState } from "react";

import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

import classes from "./Header.module.scss";
import { Link, useHistory } from "react-router-dom";

import { FaShoppingCart, FaUserAlt } from "react-icons/fa";

const Header = () => {
    const history = useHistory();
    const [menuOpen, setMenuOpen] = useState(false);
    const [size, setSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (size.width > 768 && menuOpen) {
            setMenuOpen(false);
        }
    }, [size.width, menuOpen]);

    const menuToggleHandler = () => {
        setMenuOpen((p) => !p);
    };

    {/*const ctaClickHandler = () => {
        menuToggleHandler();
        history.push("/login");
    };

    const ctbClickHandler = () => {
        menuToggleHandler();
        history.push("/sign");
    };
    */}

    return (
        <header className={classes.header}>
            <div className={classes.header__content}>
                <Link to="/images" className={classes.header__content__logo}>
                CloudBox
                </Link>
                <nav
                    className={`${classes.header__content__nav} ${
                        menuOpen && size.width < 768 ? classes.isMenu : ""
                    }`}
                >

                    <ul>
                

                        <li>
                            <Link to="/images" onClick={menuToggleHandler}>
                                Images
                            </Link>
                        </li>
                        <li>
                            <Link to="/photo" onClick={menuToggleHandler}>
                                Notes
                            </Link>
                        </li>
                        
                    

                    </ul>

                    

                    {/*<button onClick={ctaClickHandler}>Login</button> 
                    &nbsp;
                    <button className="buttonA" onClick={ctbClickHandler}>Sign in</button>
                */}
                </nav>
                <div className={classes.header__content__toggle}>
                    {!menuOpen ? (
                        <BiDotsVerticalRounded onClick={menuToggleHandler} />
                    ) : (
                        <AiOutlineClose onClick={menuToggleHandler} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
