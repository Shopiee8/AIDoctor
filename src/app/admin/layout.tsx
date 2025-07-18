
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout component is needed to group the routes,
    // but it doesn't need to render any UI.
    return <>{children}</>;
}
