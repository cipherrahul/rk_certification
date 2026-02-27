import { getStudentByIdAction } from "@/lib/actions/student.action";
import { StudentEnrollmentForm } from "@/components/students/StudentEnrollmentForm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditStudentPage({ params }: { params: { id: string } }) {
    const studentId = params.id;
    const result = await getStudentByIdAction(studentId);

    if (!result.success || !result.data) {
        return notFound();
    }

    const student = result.data;

    // Map DB fields to Form fields
    const initialData = {
        firstName: student.first_name,
        lastName: student.last_name,
        dateOfBirth: new Date(student.date_of_birth),
        fatherName: student.father_name,
        mobile: student.mobile,
        course: student.course,
        academicSession: student.academic_session,
        studentClass: student.student_class,
        totalCourseFee: student.total_course_fee,
        admissionFee: student.admission_fee,
        monthlyFeeAmount: student.monthly_fee_amount,
        paymentStartDate: new Date(student.payment_start_date),
        paymentMode: student.payment_mode,
        branchId: student.branch_id,
        classId: student.class_id,
        photo_url: student.photo_url,
    };

    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
                <p className="text-muted-foreground mt-1">Update information for {student.first_name} {student.last_name}.</p>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <StudentEnrollmentForm studentId={studentId} initialData={initialData} />
                </CardContent>
            </Card>
        </div>
    );
}
