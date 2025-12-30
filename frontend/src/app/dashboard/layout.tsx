import AuthLayout from "@/components/layouts/AuthLayout";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthLayout>{children}</AuthLayout>;
}