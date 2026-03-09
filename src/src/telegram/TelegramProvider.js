import React, { createContext, useContext, useEffect } from 'react';

const TelegramContext = createContext(null);

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider = ({ children }) => {
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
      tg.MainButton.hide();
      
      // Enable haptic feedback
      tg.enableClosingConfirmation();
    }
  }, [tg]);

  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showPopup = (title, message, buttons) => {
    if (tg) {
      tg.showPopup({ title, message, buttons });
    } else {
      alert(`${title}: ${message}`);
    }
  };

  const hapticFeedback = (type = 'impact', style = 'medium') => {
    if (tg?.HapticFeedback) {
      if (type === 'impact') {
        tg.HapticFeedback.impactOccurred(style);
      } else if (type === 'notification') {
        tg.HapticFeedback.notificationOccurred(style);
      }
    }
  };

  const value = {
    tg,
    user: tg?.initDataUnsafe?.user,
    showAlert,
    showPopup,
    hapticFeedback
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};
