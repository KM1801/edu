import React, { useContext } from 'react';
import css from './header.module.scss';
import MainContext from '../main_context';

const Header = ({Room}) => {
  const contextData = useContext(MainContext);
  return (
    <>
      <div className={css.header_main_upper}>
            {Room}
      </div>
    </>
  );
}

export default Header;