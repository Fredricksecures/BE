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
  
  