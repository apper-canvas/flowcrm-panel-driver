const NotificationItem = ({ notification }) => {
  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
      <p className="text-sm text-gray-900">{notification.text}</p>
      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
    </div>
  );
};

export default NotificationItem;