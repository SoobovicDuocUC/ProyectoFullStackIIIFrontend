import "./Badge.css";

export const Badge = ({ children, variant = "default" }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case "success":
        return 'badge-success';
      case "warning":
        return 'badge-warning';
      case "danger":
        return 'badge-danger';
      case "critica":
        return 'badge-critica';
      case "alta":
        return 'badge-alta';
      case "media":
        return 'badge-media';
      case "baja":
        return 'badge-baja';
      default:
        return 'badge-default';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {children}
    </span>
  );
};
