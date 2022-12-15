import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Chapter } from 'src/entities/chapter.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Subject } from 'src/entities/subject.entity';




export class createLessonReq {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  chapterId: string;

}
export class createChapterReq {
    @IsNotEmpty()
    @IsString()
    type: string;
  
    @IsNotEmpty()
    @IsString()
    subjectId: string;
  
  }
  export class createSubjectReq {
    @IsNotEmpty()
    @IsString()
    type: string;
  
    @IsNotEmpty()
    @IsString()
    learningPackageId: string;
  
  }
  export class updateChapterReq {
    @IsNotEmpty()
    @IsString()
    type: string;
  
  }
  export class updateLessonReq {
    @IsNotEmpty()
    @IsString()
    type: string;
  }
  export class updateSubjectReq {
    @IsNotEmpty()
    @IsString()
    type: string;
  }
  export class createTestReq {
    @IsNotEmpty()
    @IsString()
    topic: string;
  
    @IsNotEmpty()
    @IsString()
    lessonId: string;
  
  }
  export class updateTestReq {
    @IsNotEmpty()
    @IsString()
    topic: string;
   
  }
  export class createReportCardReq {
    @IsNotEmpty()
    @IsString()
    remark: string;
  
    @IsNotEmpty()
    @IsString()
    lessonId: string;

    @IsNotEmpty()
    @IsString()
    subjectId: string;

    @IsNotEmpty()
    @IsString()
    studentId: string;

    @IsNotEmpty()
    @IsString()
    testId: string;
  
  }
 
  
  