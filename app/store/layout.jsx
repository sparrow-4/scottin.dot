import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Scottin.dot - Store Dashboard",
    description: "Scottin.dot - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
