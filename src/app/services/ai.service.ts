import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  AIConversation,
  AIMessage,
  ChatRequest,
  SkillAnalysisRequest,
  SkillAnalysisResult,
  CareerRecommendationRequest,
  CareerRecommendation,
  ApiResponse
} from '../models/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'https://localhost:7000/api/EnhancedAI';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  chatWithAssistant(request: ChatRequest): Observable<{ response: string }> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ response: string }>(`${this.apiUrl}/chat`, request, { headers });
  }

  analyzeSkills(request: SkillAnalysisRequest): Observable<SkillAnalysisResult> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<SkillAnalysisResult>(`${this.apiUrl}/analyze-skills`, request, { headers });
  }

  recommendCareers(request: CareerRecommendationRequest): Observable<CareerRecommendation[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<CareerRecommendation[]>(`${this.apiUrl}/recommend-careers`, request, { headers });
  }

  getInterviewTips(jobTitle: string): Observable<{ tips: string }> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<{ tips: string }>(`${this.apiUrl}/interview-tips`, { templateId: jobTitle }, { headers });
  }

  getConversations(pageNumber: number = 1, pageSize: number = 20): Observable<AIConversation[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<AIConversation[]>(`${this.apiUrl}/conversations?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
  }

  getConversationMessages(conversationId: number, pageNumber: number = 1, pageSize: number = 50): Observable<AIMessage[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<AIMessage[]>(`${this.apiUrl}/conversations/${conversationId}/messages?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers });
  }
}
